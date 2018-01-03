class Post < ActiveRecord::Base
  attr_accessible :body, :category_id, :title, :user_id, :lock_version
  belongs_to :category

  ## habtm
  has_and_belongs_to_many :tags

  ## has_many :through
  has_many :post_labels
  has_many :labels, through: :post_labels

  validates :title, :user_id, presence:true

  scope :for_php, where(category_id:1)
end
