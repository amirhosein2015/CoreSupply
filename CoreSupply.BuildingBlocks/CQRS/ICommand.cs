using MediatR;

namespace CoreSupply.BuildingBlocks.CQRS
{
    // دستوری که خروجی ندارد (void)
    public interface ICommand : IRequest<Unit>
    {
    }

    // دستوری که خروجی دارد (مثلاً شناسه رکورد ساخته شده)
    public interface ICommand<out TResponse> : IRequest<TResponse>
    {
    }
}
