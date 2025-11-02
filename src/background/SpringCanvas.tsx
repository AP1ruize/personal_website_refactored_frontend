import React, { useEffect, useRef } from "react";

const SpringCanvas = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const petals = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: 15 + Math.random() * 10,
      speedY: 0.5 + Math.random() * 1,
      speedX: 0.2 + Math.random() * 0.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 1.2, // 🌟 随机旋转速度
      alpha: 0.9 + Math.random() * 0.1, // 初始透明度
      swayOffset: Math.random() * 1000, // 🌬️ 用于风摆动偏移
      img: (() => {
        const i = new Image();
        i.src = "/sakura_li.png"; // 一张透明花瓣PNG
        return i;
      })(),
    }));

    let frame = 0;

    const draw = () => {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => {
        // 🌬️ 模拟轻风摆动（左右小幅度偏移）
        const sway = Math.sin((frame + p.swayOffset) * 0.01) * 1.5;
        p.x -= p.speedX + sway * 0.1;
        p.y += p.speedY;
        // 🌸 更新旋转与透明度
        p.rotation += p.rotationSpeed;
        p.alpha = 0.9 + Math.sin((frame + p.swayOffset) * 0.02) * 0.1;
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
      requestAnimationFrame(draw);
    };
    draw();
  }, []);

  return (
    // <canvas ref={ref} className="fixed top-0 left-0 w-full h-full -z-10" />
    <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      overflow: "hidden",
      zIndex: -10,
      backgroundImage: 'url("/spring_bg_li.jpg")', // 🌸 背景图片路径
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <canvas
      ref={ref}
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

export default SpringCanvas;
