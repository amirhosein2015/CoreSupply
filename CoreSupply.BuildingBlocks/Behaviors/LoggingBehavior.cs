using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace CoreSupply.BuildingBlocks.Behaviors
{
    public class LoggingBehavior<TRequest, TResponse>
        : IPipelineBehavior<TRequest, TResponse>
        where TRequest : notnull
    {
        private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

        public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
        {
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            var requestName = typeof(TRequest).Name;

            _logger.LogInformation("[START] Handling command {RequestName}", requestName);

            var timer = Stopwatch.StartNew();
            var response = await next();
            timer.Stop();

            if (timer.Elapsed.Seconds > 3)
            {
                _logger.LogWarning("[PERFORMANCE] The command {RequestName} took {TimeTaken} seconds", requestName, timer.Elapsed.Seconds);
            }

            _logger.LogInformation("[END] Handled command {RequestName} in {TimeTaken}ms", requestName, timer.Elapsed.Milliseconds);

            return response;
        }
    }
}
