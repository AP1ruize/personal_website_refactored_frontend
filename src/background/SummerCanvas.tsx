import React, { useEffect, useRef } from "react";

const SummerCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 光束配置
    const rayCount = 8;
    const areaStartX = canvas.width * 0.55; // 光束起点区域（右侧 1/3）
    const areaEndX = canvas.width * 0.95;
    const spacing = (areaEndX - areaStartX) / rayCount; // 固定间距

    const rays = Array.from({ length: rayCount }, (_, i) => ({
      x: areaStartX + i * spacing,
      y: 0,
      topWidth: 40,
      bottomWidth: 200,
      h: canvas.height * 0.8,
      opacity: 0.06 + Math.random() * 0.06,
      speed: 0.08, // 慢速平滑移动
      tilt: -0.2 + Math.random() * 0.1,
    }));

    // 阳光浮尘粒子配置
    const dustCount = 150;
    const dust = Array.from({ length: dustCount }, () => ({
      x: areaStartX + Math.random() * (areaEndX - areaStartX),
      y: Math.random() * canvas.height * 0.8,
      r: 0.5 + Math.random() * 1.5,
      speedY: 0.3 + Math.random() * 0.5,
      alphaBase: 0.3 + Math.random() * 0.5,
      phase: Math.random() * 1000,
    }));

    let frame = 0;

    let frameId: number;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;
    const startTime = performance.now() + 600;

    const draw = (time: number) => {
      frameId = requestAnimationFrame(draw);
      if (time < startTime || time - lastTime < interval) return; // 控制帧率
      lastTime = time;


      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 背景光雾层
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(255,255,240,0.08)");
      gradient.addColorStop(1, "rgba(255,255,240,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制光束（上窄下宽梯形）
      rays.forEach(r => {
        const topHalf = r.topWidth / 2;
        const bottomHalf = r.bottomWidth / 2;
        const tiltOffset = r.tilt * r.h;

        const rayGrad = ctx.createLinearGradient(r.x, r.y, r.x + tiltOffset, r.y + r.h);
        rayGrad.addColorStop(0, `rgba(255,255,210,${r.opacity})`);
        rayGrad.addColorStop(0.6, `rgba(255,255,210,${r.opacity * 0.4})`);
        rayGrad.addColorStop(1, `rgba(255,255,210,0)`);

        ctx.fillStyle = rayGrad;
        ctx.beginPath();
        ctx.moveTo(r.x - topHalf, r.y);
        ctx.lineTo(r.x + topHalf, r.y);
        ctx.lineTo(r.x + bottomHalf + tiltOffset, r.y + r.h);
        ctx.lineTo(r.x - bottomHalf + tiltOffset, r.y + r.h);
        ctx.closePath();
        ctx.fill();

        // 光线水平漂移
        r.x += r.speed;
        if (r.x - r.bottomWidth / 2 > areaEndX) {
          r.x = areaStartX - r.bottomWidth / 2;
        }
      });

      // 绘制阳光浮尘粒子
      dust.forEach(p => {
        const alpha = p.alphaBase + Math.sin((frame + p.phase) * 0.02) * 0.2;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

        // 光尘颜色带一点暖黄色
        ctx.fillStyle = "rgba(255, 250, 200, 1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        // 漂浮运动：轻微上下漂 + 缓慢水平移动
        p.y += Math.sin((frame + p.phase) * 0.01) * 0.03;
        p.x += 0.02; // 缓慢向右移动

        // 超出边界重生
        if (p.x > areaEndX) {
          p.x = areaStartX;
          p.y = Math.random() * canvas.height * 0.8;
        }
      });

      ctx.globalAlpha = 1;
      // requestAnimationFrame(draw);
    };

    // draw();
    frameId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    // <canvas ref={ref} className="fixed top-0 left-0 w-full h-full -z-10" />
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      zIndex: -10,
      backgroundImage: 'url("/summer_bg.jpg")', // 背景图片路径
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

// export default SummerCanvas;
export default React.memo(SummerCanvas);
