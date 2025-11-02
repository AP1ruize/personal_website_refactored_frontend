import React, { useEffect, useRef } from "react";

const AutumnCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  const img_paths = ["/maple_r.png", "/maple_o.png", "/maple_y.png"];

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 预加载图片（防止首帧卡顿）
    const loadedImgs: HTMLImageElement[] = [];
    img_paths.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.decode?.().catch(() => {}); // 尝试提前解码
      loadedImgs.push(img);
    });

    const petals = Array.from({ length: 25 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 15 + Math.random() * 10,
      speedY: 1 + Math.random() * 2,
      speedX: 0.4 + Math.random() * 1,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.2, //  随机旋转速度
      alpha: 0.8 + Math.random() * 0.2, // 初始透明度
      swayOffset: Math.random() * 1000, // 用于风摆动偏移
      img: (() => {
        const i = new Image();
        i.src = img_paths[Math.floor(Math.random() * 3)]; // 一张透明花瓣PNG
        return i;
      })(),
    }));

    let frame = 0;

    let frameId: number;
    let lastTime = 0;
    const fps = 30; //  限制帧率为30fps
    const interval = 1000 / fps;
    //  延迟启动动画（避免首屏阻塞）
    const startDelay = 600; // ms
    const startTime = performance.now() + startDelay;

    const draw = (time: number) => {
      frameId = requestAnimationFrame(draw);
      if (time < startTime) return; // 等待延迟
      if (time - lastTime < interval) return; // 控制帧率
      lastTime = time;

        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
        //  模拟轻风摆动（左右小幅度偏移）
        const sway = Math.sin((frame + p.swayOffset) * 0.01) * 1.5;
        p.x -= p.speedX + sway * 0.1;
        p.y += p.speedY;
        //  更新旋转与透明度
        p.rotation += p.rotationSpeed;
        p.alpha = 0.8 + Math.sin((frame + p.swayOffset) * 0.02) * 0.2;
        // p.rotation += 0.5;

        // 超出屏幕后重生逻辑
        if (p.y > canvas.height || p.x < -p.size) {
            const fromTop = Math.random() < 0.6; // 一半从上边界来，一半从右边界来
            if (fromTop) {
                // 从上边界进入（右半边）
                p.x = canvas.width / 2 + Math.random() * canvas.width / 2;
                p.y = -10;
            } else {
                // 从右边界进入（上半部分）
                p.x = canvas.width + 10;
                p.y = Math.random() * canvas.height / 2;
            }
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.drawImage(p.img, -p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      // requestAnimationFrame(draw);
    };
    // draw();

    frameId = requestAnimationFrame(draw);

    // ✅ 3. 组件卸载时清理
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
      backgroundImage: 'url("/autumn_bg.jpg")', // 🌸 背景图片路径
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

// export default AutumnCanvas;
export default React.memo(AutumnCanvas);
