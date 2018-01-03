class CreateGourmets < ActiveRecord::Migration
  def change
    create_table :gourmets do |t|
      t.string :name, null:false, limit:50
      t.string :genres
      t.string :areas

      t.timestamps
    end
  end
end
