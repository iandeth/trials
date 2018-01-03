class Category < ActiveRecord::Base
  attr_accessible :name, :sort_order
  has_many :posts
  validates :name, :sort_order, presence:true
end
