FROM rust:latest

# wasm 타겟 및 wasm-pack 설치
RUN rustup target add wasm32-unknown-unknown \
    && rustup component add clippy \
    && cargo install wasm-pack

WORKDIR /app

COPY . .

# 기본 명령: 네이티브 빌드
CMD ["cargo", "build"]
