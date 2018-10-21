import * as cheerio from 'cheerio';
import { TestCaseParserOutput } from '../shared/Selenium';

export default class HtmlParser {

  public testCase(html: string): TestCaseParserOutput {

    const $ = cheerio.load(html);

    const steps: string[][] = [];

    const $suiteTable = $('#suiteTable');
    const $table = $suiteTable.length ? $suiteTable : $('table');

    $table.find('tbody tr').each(function(index, item) {
      const step = [];
      const $item = $(item);

      $item.find('td').each(function(tdIndex, td) {
        step.push($(td).text().trim());
      });

      return steps.push(step);
    });

    return {
      base : $('link[rel="selenium.base"]').attr('href'),
      title : $('title').text() || $('h1,h2').text(),
      steps
    };
  }

}
