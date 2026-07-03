export class FpsMonitor {
  private static readonly INTERVAL_IN_SEC = 0.25;
  private timer = 0;

  constructor() {}

  public update(dt: number): number | null {
    this.timer += dt;

    if (this.timer >= FpsMonitor.INTERVAL_IN_SEC) {
      this.timer = 0;

      return 1 / dt; //fps
    }

    return null;
  }
}
