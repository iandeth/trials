class PostLabelsController < ApplicationController
  # GET /post_labels
  # GET /post_labels.json
  def index
    @post_labels = PostLabel.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @post_labels }
    end
  end

  # GET /post_labels/1
  # GET /post_labels/1.json
  def show
    @post_label = PostLabel.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @post_label }
    end
  end

  # GET /post_labels/new
  # GET /post_labels/new.json
  def new
    @post_label = PostLabel.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @post_label }
    end
  end

  # GET /post_labels/1/edit
  def edit
    @post_label = PostLabel.find(params[:id])
  end

  # POST /post_labels
  # POST /post_labels.json
  def create
    @post_label = PostLabel.new(params[:post_label])

    respond_to do |format|
      if @post_label.save
        format.html { redirect_to @post_label, notice: 'Post label was successfully created.' }
        format.json { render json: @post_label, status: :created, location: @post_label }
      else
        format.html { render action: "new" }
        format.json { render json: @post_label.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /post_labels/1
  # PUT /post_labels/1.json
  def update
    @post_label = PostLabel.find(params[:id])

    respond_to do |format|
      if @post_label.update_attributes(params[:post_label])
        format.html { redirect_to @post_label, notice: 'Post label was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @post_label.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /post_labels/1
  # DELETE /post_labels/1.json
  def destroy
    @post_label = PostLabel.find(params[:id])
    @post_label.destroy

    respond_to do |format|
      format.html { redirect_to post_labels_url }
      format.json { head :no_content }
    end
  end
end
