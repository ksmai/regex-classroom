import { SummaryDialogComponent } from './summary-dialog.component';

describe('SummaryDialogComponent', () => {
  let comp: SummaryDialogComponent;

  it('should compute hit rates, miss rate and average time', () => {
    const data = {
      nHit: 6,
      nMiss: 4,
      time: 1000,
    };
    comp = new SummaryDialogComponent(data);
    comp.ngOnInit();
    expect(comp.hitRate).toEqual(60);
    expect(comp.missRate).toEqual(40);
    expect(comp.averageTime).toEqual('0.10');
  });

  it('should handle zero gracefully', () => {
    const data = {
      nHit: 0,
      nMiss: 0,
      time: 0,
    };
    comp = new SummaryDialogComponent(data);
    comp.ngOnInit();
    expect(comp.hitRate).toEqual(0);
    expect(comp.missRate).toEqual(0);
    expect(comp.averageTime).toEqual(0);
  });
});
