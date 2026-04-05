FROM rust:latest

# 기본 개발 도구 설치
RUN rustup component add clippy

WORKDIR /app

COPY . .

# 기본 명령: 네이티브 빌드
CMD ["cargo", "build"]
