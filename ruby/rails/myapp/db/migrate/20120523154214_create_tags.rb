class CreateTags < ActiveRecord::Migration
  def change
    create_table :tags do |t|
      t.string :name, presence:true

      t.timestamps
    end

    create_table :posts_tags do |t|
      t.integer :post_id, presence:true
      t.integer :tag_id, presence:true
    end
  end
end
