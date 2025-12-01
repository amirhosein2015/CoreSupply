using MediatR;

namespace CoreSupply.BuildingBlocks.CQRS
{
    // هندلر برای دستورات بدون خروجی
    public interface ICommandHandler<in TCommand> : IRequestHandler<TCommand, Unit>
        where TCommand : ICommand
    {
    }

    // هندلر برای دستورات با خروجی
    public interface ICommandHandler<in TCommand, TResponse> : IRequestHandler<TCommand, TResponse>
        where TCommand : ICommand<TResponse>
    {
    }
}
