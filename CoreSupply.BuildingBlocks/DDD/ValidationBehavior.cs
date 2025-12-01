using CoreSupply.BuildingBlocks.CQRS;
using FluentValidation;
using MediatR;

namespace CoreSupply.BuildingBlocks.Behaviors
{
    public class ValidationBehavior<TRequest, TResponse>
        : IPipelineBehavior<TRequest, TResponse>
        where TRequest : ICommand<TResponse> // فقط روی کامندها (نوشتن) اجرا شود
    {
        private readonly IEnumerable<IValidator<TRequest>> _validators;

        public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
        {
            _validators = validators;
        }

        public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
        {
            // اگر هیچ قانونی (Validator) تعریف نشده، عبور کن
            if (!_validators.Any())
            {
                return await next();
            }

            var context = new ValidationContext<TRequest>(request);

            // اجرای تمام اعتبارسنجی‌ها به صورت همزمان
            var validationResults = await Task.WhenAll(
                _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

            // جمع‌آوری خطاها
            var failures = validationResults
                .Where(r => r.Errors.Any())
                .SelectMany(r => r.Errors)
                .ToList();

            // اگر خطایی بود، متوقف شو و خطا برگردان
            if (failures.Any())
            {
                throw new ValidationException(failures);
            }

            return await next();
        }
    }
}
