class GourmetsController < ApplicationController
  def index
    @gourmets = Gourmet.all
  end

  def show
    @gourmet = Gourmet.find(params[:id])
  end

  def new
    @gourmet = Gourmet.new
  end

  def edit
    @gourmet = Gourmet.find(params[:id])
  end

  def create
    @gourmet = Gourmet.new(params[:gourmet])
    if @gourmet.save
      redirect_to @gourmet, notice: 'Gourmet was successfully created.'
    else
      render action: "new"
    end
  end

  def update
    @gourmet = Gourmet.find(params[:id])
    
    ## チェックボックス全消しの場合の対応
    params[:gourmet][:genres] = nil if !params[:gourmet][:genres]

    if @gourmet.update_attributes(params[:gourmet])
      redirect_to @gourmet, notice: 'Gourmet was successfully updated.'
    else
      render action: "edit"
    end
  end

  def destroy
    @gourmet = Gourmet.find(params[:id])
    @gourmet.destroy
    redirect_to gourmets_url
  end
end
