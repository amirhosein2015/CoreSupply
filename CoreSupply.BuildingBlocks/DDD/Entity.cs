namespace CoreSupply.BuildingBlocks.DDD
{
    public abstract class Entity<TId>
    {
        public TId Id { get; protected set; }

        // Audit Log: چه کسی و چه زمانی این رکورد را ساخته/ویرایش کرده؟
        public DateTime? CreatedAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime? LastModified { get; set; }
        public string? LastModifiedBy { get; set; }
    }
}
