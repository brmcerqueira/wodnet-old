import { WodnetPage } from './app.po';

describe('wodnet App', function() {
  let page: WodnetPage;

  beforeEach(() => {
    page = new WodnetPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
