/**
 * Turns a filename into a readble format
 * @param  {string} filename just the filename, paths should not be included
 * @return {string}          a human friendly version of the filename
 */
export function humanFilename(filename: string): string {
  filename = filename || '';
  const title = filename.replace(/\.js/, '');
  return title.slice(0, 1).toUpperCase() + title.slice(1);
}
