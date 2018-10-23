import * as fm from 'front-matter';
import * as marked from 'marked';

import HtmlParser from './HtmlParser';
import { TestCaseParserOutput } from '../shared/Selenium';

const htmlParserInstance = new HtmlParser();
interface FrontMatterAttributes {
  baseUrl: string;
  title: string;
}

export default class MarkdownParser {

  public testCase(txt: string): TestCaseParserOutput {

    const { baseUrl, title } = fm<FrontMatterAttributes>(txt).attributes;

    const html = marked(txt, {
      gfm : true
    });

    const result = htmlParserInstance.testCase(html);

    return {
      base : baseUrl,
      title : title || result.title,
      steps : result.steps
    };

  }

}
