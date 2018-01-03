class CreatePostLabels < ActiveRecord::Migration
  def change
    create_table :post_labels do |t|
      t.integer :post_id
      t.integer :label_id
      t.text :memo

      t.timestamps
    end
  end
end
