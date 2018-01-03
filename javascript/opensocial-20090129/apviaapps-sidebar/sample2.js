function request() {
    var idspec = opensocial.newIdSpec({ "userId" : "OWNER", "groupId" : "FRIENDS" });
    var req = opensocial.newDataRequest();
    req.add( req.newFetchPersonRequest( opensocial.IdSpec.PersonId.OWNER ), "get_owner" );
    req.add( req.newFetchPeopleRequest( idspec ), "get_friends" );
    req.send( response );
};

function response( dataResponse ) {
    var owner = dataResponse.get( 'get_owner' ).getData();
    var friends = dataResponse.get( 'get_friends' ).getData(); 
    var html = 'Friends of ' + owner.getDisplayName();
    html += ':<br><ul>';
    friends.each(function( person ) {
        console.log( person );
        html += '<li>' + person.getDisplayName() + '</li>';
    });
    html += '</ul>';
    $( '#main' ).html( html );
};

function render_ui() {
    var ui = 
          '<div id="sidebar">'
        + '    <script src="http://parts.apviaapps.com/ad/js/doko_wrapper.js#siteid=sclapp10&amp;client=4a8923420c491bcbb34c737330cc387b" type="text/javascript"></script>'
        + '</div>'
        + '<div id="main"></div>';
    $( '#content' ).html( ui );
};

function init() {
    render_ui();
    request();
};

gadgets.util.registerOnLoadHandler( init );
