
export default function cssSelector(selector: string) :string {

  selector = selector || '';
  selector = selector.toString().trim();

  if (selector.slice(0, 3) === 'id=') {
    return '#' + selector.slice(3);
  }

  if (selector.slice(0, 4) === 'css=') {
    return selector.slice(4);
  }

  if (selector.slice(0, 5) === 'link=') {
    return selector.slice(5);
  }

  // Selenium scripts tend to record the click to the element
  // and then type iside the input field
  // The zombie API is a bit inconsistent. Browser.fill accepts just
  // the field's name, but a click wont.
  // For example in zombie:
  // This works: browser.fill('search', 'something');
  // This doesn't: browser.click('search');
  // So wrapping a name identifier to zombie to the css selector seems
  // like the right thing to do.
  if (selector.slice(0, 5) === 'name=') {
    return `[name=${selector.slice(5)}]`;
  }

  // As explained in the selenium documentation identifiers are
  // represented in css as the ID or by the field name
  // http://www.seleniumhq.org/docs/02_selenium_ide.jsp#locating-by-identifier
  // The following implementation is what I think is as close to what selenium does
  if (selector.slice(0, 11) === 'identifier=') {
    const identifier = selector.slice(11);
    return '#' + identifier + ',[name=' + identifier + ']';
  }

  // In this zombie implementation xpath selectors can be queried
  // but they need to call another zombie function. So it needs to happen
  // at the transpilie time, so now we prepare we prepend the selector with xpath:
  // the transpiler step can find these selectors and conver them to the
  // correct implementation
  // https://github.com/assaf/zombie/blob/v2.5.1/src/zombie/browser.coffee#L480
  if (selector.slice(0, 2) === '//') {
    return 'xpath:' + selector;
  }
  if (selector.slice(0, 6) === 'xpath=') {
    return 'xpath:' + selector.slice(6);
  }

  // The selector is returned as it was sent if it can't
  // be transformed in any way prior to reaching this return.
  return selector;

};
