# encoding: utf-8
class Gourmet < ActiveRecord::Base
  attr_accessible :areas, :genres, :name
  serialize :genres, Hash
  serialize :areas, Hash

  validates :name, presence:true

  GENRES = {
    fastfood: 'ファストフード',
    chinese: '中華',
    western: '洋食'
  }

  AREAS = {
    1 => '東京',
    2 => '千葉',
    3 => '埼玉'
  }

  ## f.check_box を使う方式で利用
  def method_missing(meth, *args)
    meth = meth.to_s
    if m = meth.match(/^has_area_(\d+)$/)
      return (areas[m[1]].to_i > 0)? true : false
    else
      super
    end
  end
end
