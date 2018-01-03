class CreateUploads < ActiveRecord::Migration
  def change
    create_table :uploads do |t|
      t.string :name
      t.string :img_file_name
      t.string :img_content_type
      t.integer :img_file_size
      t.datetime :img_updated_at

      t.timestamps
    end
  end
end
