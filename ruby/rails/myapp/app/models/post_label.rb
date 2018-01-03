class PostLabel < ActiveRecord::Base
  attr_accessible :label_id, :memo, :post_id
  belongs_to :post
  belongs_to :label
  validate :memo_cant_be_poo

  private
  def memo_cant_be_poo
    errors.add(:memo, 'poo is invalid') if memo == 'poo'
  end
end
