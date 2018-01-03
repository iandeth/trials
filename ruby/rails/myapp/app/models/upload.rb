class Upload < ActiveRecord::Base
  attr_accessible :name, :img

  has_attached_file :img, styles:{ 
    medium: '100x100>', 
    small: '50x50>',
    square: '100x100#',
    png: ['100%', :png]
  },
  default_style: :medium,
  url: '/system/:class/:attachment/:id_partition/:style/:hash.:extension',
  hash_secret: 'fdsafdsaiejfkwlogfa',
  hash_data: ':class/:attachment/:id/:updated_at' #=> hash for all styles will be same

  validates :name, presence:true
  validates_attachment :img, 
    presence:true, 
    size:{ less_than:500.kilobytes },
    content_type:{ content_type:%r|^image/| }  # not working with *.txt
end
