import { DataShowcasePage } from './app.po';

describe('data-showcase App', () => {
  let page: DataShowcasePage;

  beforeEach(() => {
    page = new DataShowcasePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
