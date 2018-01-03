class CreateLabels < ActiveRecord::Migration
  def change
    create_table :labels do |t|
      t.string :name, null:false
      t.integer :sort_order, null:false

      t.timestamps
    end
  end
end
