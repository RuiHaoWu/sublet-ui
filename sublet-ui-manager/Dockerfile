FROM node:12.13.1
WORKDIR /app
COPY . .
RUN npm config set registry https://registry.npm.taobao.org/  && npm i && npm run build

FROM nginx:1.2.1
MAINTAINER wrh
ENV TZ=Asia/Shanghaibo
COPY --from=0 /app/dist /usr/share/nginx/html
COPY --from=0 /app/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD nginx -g "daemon off;"
