using MediatR;

namespace CoreSupply.BuildingBlocks.CQRS
{
    // کوئری همیشه باید خروجی داشته باشد و نال نباشد
    public interface IQuery<out TResponse> : IRequest<TResponse>
        where TResponse : notnull
    {
    }
}
