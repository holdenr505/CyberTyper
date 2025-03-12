// note the use of CommonJS (CJS) syntax. This is because Webpack runs
// in NodeJS and not the browser. NodeJS typically uses CJS syntax
import path from 'path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
    mode: "development",
    entry: "./src/front-end/main.js",
    output: { // output contains information about the output bundle
        filename: "bundle.js", // name can be whatever you want
        path: path.resolve(__dirname, "./public/dist"), // path to the output directory
        clean: true // if true, empties output directory before bundling files
    },
    devtool: 'eval-source-map',
    devServer: {
        watchFiles: ["./public/index.html"]
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            }
        ]
    }
}