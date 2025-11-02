import React, { useEffect, useRef } from "react";

const WinterCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 初始化雪花
    const snow = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 1 + Math.random() * 3,
      speed: 0.5 + Math.random() * 1.5,
      swingOffset: Math.random() * 1000, // 每片雪的相位
    }));

    let frame = 0;
    let frameId: number;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;
    const startTime = performance.now() + 600;

    const draw = (time: number) => {
      frameId = requestAnimationFrame(draw);
      if (time < startTime || time - lastTime < interval) return;
      lastTime = time;


      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 绘制雪花
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      snow.forEach(s => {
        ctx.moveTo(s.x, s.y);
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      });
      ctx.fill();

      //  更新雪花位置
      snow.forEach(s => {
        // 向下落
        s.y += s.speed;
        // 独立的轻微水平漂移
        const sway = Math.sin((frame + s.swingOffset) * 0.01) * 0.1;
        s.x += sway;

        // 重置出界的雪花
        if (s.y > canvas.height + 5) {
          s.y = -5;
          s.x = Math.random() * canvas.width;
        }
      });

      // requestAnimationFrame(draw);
    };

    // draw();
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    // <canvas ref={ref} className="fixed top-0 left-0 w-full h-full -z-10"/>
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      zIndex: -10,
      backgroundImage: 'url("/winter_bg.jpg")', // 🌸 背景图片路径
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <canvas ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1, // 画布在背景图上方
        pointerEvents: "none",
      }}
    />
  </div>
  );
};

// export default WinterCanvas;
export default React.memo(WinterCanvas);
