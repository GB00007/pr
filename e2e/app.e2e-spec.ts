import { DigitalMenuPage } from './app.po';

describe('digital-menu-page App', function() {
  let page: DigitalMenuPage;

  beforeEach(() => {
    page = new DigitalMenuPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
