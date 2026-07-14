export class FpsMonitor {
  private static readonly INTERVAL_IN_SEC = 0.25;
  private timer = 0;
  private frames = 0;

  constructor() {}

  public update(dt: number): number | null {
    this.timer += dt;
    this.frames += 1;

    if (this.timer >= FpsMonitor.INTERVAL_IN_SEC) {
      const fps = this.frames / this.timer; //average fps over the interval

      this.timer = 0;
      this.frames = 0;

      return fps;
    }

    return null;
  }
}
