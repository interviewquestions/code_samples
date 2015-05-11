class AlbumsController < ApplicationController
  load_and_authorize_resource
  skip_before_action :authenticate_user!, :only => [:show,:index,:get_album_tracks]

  def get_album_tracks
    album = Album.find(params[:id])
    playlist = Hash.new
    playlist['tracks'] = Array.new
    if album
      tracks = Track.where(:album_id => album.id)
      tracks.each do |track|
        track_data = {:title => track.title, :file => track.track_file}
        playlist['tracks'] << track_data
      end
    end
    respond_to do |format|
      format.json { render json: playlist, status: :created}
    end
  end

  def index
    @albums = Album.all
  end
 
  def show
    @album = Album.find(params[:id])
  end
 
  def new
    @album = Album.new
  end
 
  def edit
    @album = Album.find(params[:id])
  end
 
  def create
    @album = Album.new(album_params)
 
    if @album.save
      redirect_to @album
    else
      render 'new'
    end
  end
 
  def update
    @album = Album.find(params[:id])
 
    if @album.update(album_params)
      redirect_to @album
    else
      render 'edit'
    end
  end
 
  def destroy
    @album = Album.find(params[:id])
    @album.destroy
 
    redirect_to albums_path
  end
 
  private
    def album_params
      params.require(:album).permit(:title, :user_id)
    end
end
