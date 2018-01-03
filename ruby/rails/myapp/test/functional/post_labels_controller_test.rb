require 'test_helper'

class PostLabelsControllerTest < ActionController::TestCase
  setup do
    @post_label = post_labels(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:post_labels)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create post_label" do
    assert_difference('PostLabel.count') do
      post :create, post_label: { label_id: @post_label.label_id, memo: @post_label.memo, post_id: @post_label.post_id }
    end

    assert_redirected_to post_label_path(assigns(:post_label))
  end

  test "should show post_label" do
    get :show, id: @post_label
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @post_label
    assert_response :success
  end

  test "should update post_label" do
    put :update, id: @post_label, post_label: { label_id: @post_label.label_id, memo: @post_label.memo, post_id: @post_label.post_id }
    assert_redirected_to post_label_path(assigns(:post_label))
  end

  test "should destroy post_label" do
    assert_difference('PostLabel.count', -1) do
      delete :destroy, id: @post_label
    end

    assert_redirected_to post_labels_path
  end
end
