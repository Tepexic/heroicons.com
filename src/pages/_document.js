import NextDocument, { Html, Head, Main, NextScript } from 'next/document'
import * as fs from 'fs'
import * as path from 'path'

class InlineStylesHead extends Head {
  getCssLinks() {
    return this.__getInlineStyles()
  }

  __getInlineStyles() {
    const { assetPrefix, files } = this.context
    if (!files || files.length === 0) return null

    return files
      .filter((file) => /\.css$/.test(file))
      .map((file) => (
        <style
          key={file}
          nonce={this.props.nonce}
          data-href={`${assetPrefix}/_next/${file}`}
          dangerouslySetInnerHTML={{
            __html: fs.readFileSync(
              path.join(process.cwd(), '.next', file),
              'utf-8'
            ),
          }}
        />
      ))
  }
}

class Document extends NextDocument {
  static async getInitialProps(ctx) {
    const initialProps = await NextDocument.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html lang="en">
        <InlineStylesHead />
        <body className="bg-gray-50 font-sans antialiased text-gray-500">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default Document
