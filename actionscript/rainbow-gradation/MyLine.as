class MyLine extends MovieClip {
	private var color = 0;
	private function MyLine(){
		var c:Color = new Color( this );
		c.setRGB( this.color );
	}
}
