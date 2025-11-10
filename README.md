# Valid Proof

## Description

Valid Proof is an open-source and configurable website, built in [React](https://react.dev/) + [Vite](https://vitejs.dev/) and mantained by [BLOOCK](https://www.bloock.com/) which provides a carefully curated user experience that enables you to visualize all verification steps and details from a file processed by BLOOCK.

## Usage

To use this project, follow these steps:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/bloock/valid-proof.git
```

2. Navigate to the project directory:

```bash
cd valid-proof
```

3. Install dependencies:

```bash
yarn
```

4. Start the development server:

```bash
yarn start
```

5. Open your web browser and visit `http://localhost:3000` to view the website.

## API key

To access Bloock services, you need to set up an API key. You can do this by following [this guide](https://docs.bloock.com/guides/platform/create-api-key/).

In your project directory, create a `.env` file. This file will store the environment variables required for the service. Each variable should be defined using the following format:

```
VARIABLE_NAME=VALUE
```

In this case, the environment variable for the API key should be named `VITE_API_KEY`. Here's an example of how your `.env` file might look:

```
VITE_API_KEY=[YOUR API KEY]
```

## Deployment

To deploy the website, follow these steps:

1. Build the project:

```bash
yarn run build
```

2. This will create a `build` folder containing the compiled assets.

3. Host the contents of the `build` folder on your preferred web hosting service. For specific instructions for different providers check this [link](https://vitejs.dev/guide/static-deploy).

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) for details.

## Contact

For questions or feedback, please contact us at [support@bloock.com].

## Acknowledgements

![RED.ES](/public/logos-redes.png)