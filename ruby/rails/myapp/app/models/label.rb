class Label < ActiveRecord::Base
  attr_accessible :name, :sort_order
  has_many :post_labels
  has_many :posts, through: :post_labels
end
