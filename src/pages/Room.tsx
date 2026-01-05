export default function Room() {
    return (
    <div style={{ width: "100%", height: "80vh" }}>
      <iframe
        src="https://main.d2f5swcms2psne.amplifyapp.com/"
        title="Room Visualizer"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          borderRadius: "12px",
          alignSelf: "center",
        }}
      />
    </div>
  );
}