# Install node v16
FROM node:16

# Set the workdir /var/www/app
WORKDIR /usr/src/app

# Copy the package.json to workdir
COPY package.json ./

# Run npm install - install the npm dependencies
RUN npm install

# Copy application source
COPY . .

# Copy .env to workdir/.env - use the docker env
COPY ./.env ./.env

# Expose application ports - (4300 - for API and 4301 - for front end)
EXPOSE 3001


# Start the application
CMD ["npm", "run", "runApp"]