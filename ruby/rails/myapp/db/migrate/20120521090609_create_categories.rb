class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
      t.string :name, null:false, limit:50
      t.integer :sort_order, null:false

      t.timestamps
    end
  end
end
