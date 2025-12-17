import (
	"context"
	"encoding/json"
	"time"

	"github.com/heroiclabs/nakama-common/runtime"
)

func InitModule(ctx context.Context, logger runtime.Logger, nk runtime.NakamaModule, initializer runtime.Initializer) error {
	initStart := time.Now()
	logger.Info("TicTacToe Go module InitModule called.")
// 	// ví dụ: đăng ký 1 RPC test
// 	initializer.RegisterRpc("tic_tac_toe_ping", func(ctx context.Context, logger runtime.Logger, nk runtime.NakamaModule, payload string) (string, error) {
// 		resp := map[string]interface{}{
// 			"ok":      true,
// 			"message": "pong",
// 			"time_ms": time.Since(initStart).Milliseconds(),
// 		}
// 		b, _ := json.Marshal(resp)
// 		return string(b), nil
// 	})
// 	logger.Info("TicTacToe plugin loaded in '%d' msec.", time.Since(initStart).Milliseconds())
// 	return nil
}
