# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120530083317) do

  create_table "categories", :force => true do |t|
    t.string   "name",       :limit => 50, :null => false
    t.integer  "sort_order",               :null => false
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

  create_table "gourmets", :force => true do |t|
    t.string   "name",       :limit => 50, :null => false
    t.string   "genres"
    t.string   "areas"
    t.datetime "created_at",               :null => false
    t.datetime "updated_at",               :null => false
  end

  create_table "labels", :force => true do |t|
    t.string   "name",       :null => false
    t.integer  "sort_order", :null => false
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "post_labels", :force => true do |t|
    t.integer  "post_id"
    t.integer  "label_id"
    t.text     "memo"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "posts", :force => true do |t|
    t.string   "title",        :limit => 50,                :null => false
    t.text     "body"
    t.integer  "user_id",                                   :null => false
    t.integer  "category_id",                :default => 1, :null => false
    t.integer  "lock_version",               :default => 0, :null => false
    t.datetime "created_at",                                :null => false
    t.datetime "updated_at",                                :null => false
  end

  create_table "posts_tags", :force => true do |t|
    t.integer "post_id"
    t.integer "tag_id"
  end

  create_table "tags", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "uploads", :force => true do |t|
    t.string   "name"
    t.string   "img_file_name"
    t.string   "img_content_type"
    t.integer  "img_file_size"
    t.datetime "img_updated_at"
    t.datetime "created_at",       :null => false
    t.datetime "updated_at",       :null => false
  end

end
