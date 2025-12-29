FROM heroiclabs/nakama-pluginbuilder:3.35.1 AS builder

ENV GO111MODULE on
ENV CGO_ENABLED 1

WORKDIR /backend
COPY go.mod .
COPY go.sum .
COPY *.go .
COPY vendor/ vendor/

RUN go build --trimpath --mod=vendor --buildmode=plugin -o ./backend.so

FROM heroiclabs/nakama:3.35.1

COPY --from=builder /backend/backend.so /nakama/data/modules
COPY local.yml /nakama/data

