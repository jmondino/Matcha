# base image
FROM node:12.2.0-alpine

# set working directory
WORKDIR /var/www/html/react

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

EXPOSE 3000

# start app
CMD ["npm", "start"]
