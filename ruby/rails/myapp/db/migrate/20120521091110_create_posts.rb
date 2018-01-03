class CreatePosts < ActiveRecord::Migration
  def change
    create_table :posts do |t|
      t.string :title, null:false, limit:50
      t.text :body
      t.integer :user_id, null:false
      t.integer :category_id, null:false, default:1
      t.integer :lock_version, null:false, default:0

      t.timestamps
    end
  end
end
