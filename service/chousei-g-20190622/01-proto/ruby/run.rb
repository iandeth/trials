require 'googleauth'
require 'googleauth/stores/file_token_store'
require 'google/apis/oauth2_v2'
require 'google/apis/calendar_v3'
require 'thor'
require 'pp'

class App < Thor
  include Thor::Actions

  Oauth2 = Google::Apis::Oauth2V2
  Calendar = Google::Apis::CalendarV3
  OOB_URI = 'urn:ietf:wg:oauth:2.0:oob'

  SCOPE = [
    Oauth2::AUTH_USERINFO_EMAIL,
    Oauth2::AUTH_USERINFO_PROFILE,
    Calendar::AUTH_CALENDAR_READONLY,
    Calendar::AUTH_CALENDAR_EVENTS
  ]

  class_option :api_key, :type => :string

  no_commands do
    def client_secrets_path
      return ENV['GOOGLE_CLIENT_SECRETS'] if ENV.has_key?('GOOGLE_CLIENT_SECRETS')
      return File.join(__dir__, 'config', 'client_secrets.json')
    end

    def token_store_path
      return ENV['GOOGLE_CREDENTIAL_STORE'] if ENV.has_key?('GOOGLE_CREDENTIAL_STORE')
      return File.join(__dir__, 'config', 'credentials.yaml')
    end

    def application_credentials_for(scope)
      ENV['GOOGLE_APPLICATION_CREDENTIALS'] = 'config/application_default_credentials.json'
      Google::Auth.get_application_default(scope)
    end

    def user_credentials_for(scope, user_id)
      FileUtils.mkdir_p(File.dirname(token_store_path))

      if ENV['GOOGLE_CLIENT_ID']
        client_id = Google::Auth::ClientId.new(ENV['GOOGLE_CLIENT_ID'], ENV['GOOGLE_CLIENT_SECRET'])
      else
        client_id = Google::Auth::ClientId.from_file(client_secrets_path)
      end
      token_store = Google::Auth::Stores::FileTokenStore.new(:file => token_store_path)
      authorizer = Google::Auth::UserAuthorizer.new(client_id, scope, token_store)

      credentials = authorizer.get_credentials(user_id)
      if credentials.nil?
        url = authorizer.get_authorization_url(base_url: OOB_URI)
        say "Open the following URL in your browser and authorize the application."
        say url
        code = ask "Enter the authorization code:"
        credentials = authorizer.get_and_store_credentials_from_code(
          user_id: user_id, code: code, base_url: OOB_URI)
      end
      credentials
    end

    def api_key
      ENV['GOOGLE_API_KEY']
    end
  end

  desc 'auth', 'do oauth2'
  method_option :user, type: :string, required: true
  def auth
    pp user_credentials_for(SCOPE, options[:user])
  end

  desc 'auth_with_code', 'get credentials from already retrieved authorization code'
  method_option :user, type: :string, required: true
  def auth_with_code
    client_id = Google::Auth::ClientId.from_file(client_secrets_path)
    token_store = Google::Auth::Stores::FileTokenStore.new(:file => token_store_path)
    authorizer = Google::Auth::UserAuthorizer.new(client_id, SCOPE, token_store)

    code = ask "Enter the authorization code:"
    pp authorizer.get_and_store_credentials_from_code(user_id:options[:user], code:code, base_url:OOB_URI)
  end

  desc 'userinfo', 'get user info'
  method_option :user, type: :string, required: true
  def userinfo
    auth = Oauth2::Oauth2Service.new
    auth.authorization = user_credentials_for(SCOPE, options[:user])
    info = auth.get_userinfo_v2()
    pp info
  end

  desc 'list_events', 'List upcoming events'
  method_option :user, type: :string, required: true
  method_option :limit, type: :numeric
  def list_events
    calendar = Calendar::CalendarService.new
    calendar.authorization = user_credentials_for(SCOPE, options[:user])

    limit = options[:limit] || 10
    page_token = nil
    begin
      opt = {
        max_results: limit,
        single_events: true,
        order_by: 'startTime',
        time_min: Time.now.iso8601,
        page_token: page_token,
        fields: 'items(id,summary,start),next_page_token'
      }
      result = calendar.list_events('primary', opt)
      result.items.each do |event|
        time = event.start.date_time || event.start.date
        say "#{time}, #{event.summary}"
      end
      limit -= result.items.length
      if result.next_page_token
        page_token = result.next_page_token
      else
        page_token = nil
      end
    end while !page_token.nil? && limit > 0
  end

  # needs AUTH_CALENDAR scope
  desc 'cal_list', 'List all calendars'
  method_option :user, type: :string, required: true
  def cal_list
    calendar = Calendar::CalendarService.new
    calendar.authorization = user_credentials_for(SCOPE, options[:user])

    opt = {}
    result = calendar.list_calendar_lists(opt)
    result.items.each do |c|
      say "#{c.summary}, #{c.id}, #{c.primary == true}"
    end
  end

  desc 'cal_info', 'get calendar meta'
  method_option :user, type: :string, required: true
  def cal_info
    calendar = Calendar::CalendarService.new
    calendar.authorization = user_credentials_for(SCOPE, options[:user])

    opt = {}
    r = calendar.get_calendar_list('primary', opt)
    say "#{r.summary}, #{r.id}, #{r.primary == true}"
  end

  desc 'create_event', 'Create an event'
  method_option :user, type: :string, required: true
  method_option :summary, type: :string, required: true
  method_option :attendees, type: :array
  def create_event
    calendar = Calendar::CalendarService.new
    calendar.authorization = user_credentials_for(SCOPE, options[:user])

    event = Calendar::Event.new({
      summary: options[:summary],
      attendees: Array(options[:attendees]).map { |email| { email: email } },
      start: { date_time: DateTime.parse('2019-06-23 20:30:00+09') },
      end: { date_time: DateTime.parse('2019-06-23 21:10:00+09') }
    })

    opt = {
      send_notifications: true
    }

    c = calendar.insert_event('primary', event, opt)
    say "Created event '#{c.summary}' (#{c.id})"
  end
end

App.start(ARGV)
