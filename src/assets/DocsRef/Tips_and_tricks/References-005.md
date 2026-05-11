# EF Core - Upsert Approach 03

## (*) C# EF .NET Core how to create a SQL query from a dbContext that provides a relationship tables using Include() and sub ThenInclude() and end up with .Single or default?

In Entity Framework Core, you typically build a query with `.Include()` / `.ThenInclude()` and then terminate it with `.SingleOrDefault()` (or `.SingleAsync()`, `.FirstOrDefault()`, etc.).

Example with nested relationships:

```csharp
var customer = await dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
    .Include(c => c.Address)
    .SingleOrDefaultAsync(c => c.Id == customerId);
```

This generates a single SQL query (by default in recent EF Core versions unless split queries are enabled).

## What this does

Suppose your entities are:

```csharp
public class Customer
{
    public int Id { get; set; }
    public Address Address { get; set; }
    public ICollection<Order> Orders { get; set; }
}

public class Order
{
    public ICollection<OrderItem> OrderItems { get; set; }
}

public class OrderItem
{
    public Product Product { get; set; }
}
```

The query:

```csharp
.Include(c => c.Orders)
    .ThenInclude(o => o.OrderItems)
        .ThenInclude(oi => oi.Product)
```

tells EF Core to eagerly load:

* Customer
* Orders
* OrderItems
* Product

Then:

```csharp
.SingleOrDefaultAsync(c => c.Id == customerId)
```

adds the `WHERE` clause and materializes one entity.

---

## To View the Generated SQL

EF Core lets you inspect the SQL before execution:

```csharp
var query = dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
    .SingleOrDefault(c => c.Id == customerId);
```

Instead do:

```csharp
var query = dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
    .Where(c => c.Id == customerId);

string sql = query.ToQueryString();

Console.WriteLine(sql);
```

Then execute:

```csharp
var customer = await query.SingleOrDefaultAsync();
```

---

## Important Detail

`SingleOrDefault()` executes the query immediately, so you cannot call `ToQueryString()` after it.

Correct pattern:

```csharp
var query = dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
    .Where(c => c.Id == customerId);

var sql = query.ToQueryString();

var result = await query.SingleOrDefaultAsync();
```

---

## SQL Shape Generated

EF Core typically generates SQL with multiple `LEFT JOIN`s similar to:

```sql
SELECT ...
FROM Customers c
LEFT JOIN Orders o ON c.Id = o.CustomerId
LEFT JOIN OrderItems oi ON o.Id = oi.OrderId
LEFT JOIN Products p ON oi.ProductId = p.Id
WHERE c.Id = @customerId
```

---

## Common Pitfall

Avoid this:

```csharp
.SingleOrDefault(c => c.Id == id)
.Include(...)
```

because terminal operators (`Single`, `First`, `ToList`, etc.) must come last.

Correct order:

```csharp
.Include(...)
.ThenInclude(...)
.Where(...)
.SingleOrDefaultAsync()
```

---

## Recommended Modern Pattern

```csharp
var query = dbContext.Customers
    .AsNoTracking()
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
    .Where(c => c.Id == customerId);

Console.WriteLine(query.ToQueryString());

var customer = await query.SingleOrDefaultAsync();
```

Use `.AsNoTracking()` for read-only queries to improve performance.

---

## (*) Is it possible to translate and nested EF relationships to SQL queries? 

Yes. Entity Framework Core translates nested relationship loading (`Include` / `ThenInclude`) into SQL automatically.

For example:

```csharp id="8jh6m1"
var customer = await dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
            .ThenInclude(oi => oi.Product)
    .SingleOrDefaultAsync(c => c.Id == id);
```

EF Core converts that into SQL with joins similar to:

```sql id="z3e0sw"
SELECT
    c.Id,
    c.Name,
    o.Id,
    oi.Id,
    p.Id,
    p.Name
FROM Customers c
LEFT JOIN Orders o
    ON c.Id = o.CustomerId
LEFT JOIN OrderItems oi
    ON o.Id = oi.OrderId
LEFT JOIN Products p
    ON oi.ProductId = p.Id
WHERE c.Id = @id
```

---

## Ways to See the Generated SQL

### 1. `ToQueryString()` (best option)

```csharp id="9b9aj7"
var query = dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
    .Where(c => c.Id == id);

string sql = query.ToQueryString();

Console.WriteLine(sql);
```

This gives the exact SQL EF Core plans to run.

---

### 2. Enable SQL Logging

In your DbContext configuration:

```csharp id="jkw3c8"
optionsBuilder
    .UseSqlServer(connectionString)
    .LogTo(Console.WriteLine, LogLevel.Information)
    .EnableSensitiveDataLogging();
```

Now every SQL statement appears in logs/output.

---

## Important: Include vs Projection

`Include()` only works when returning entities.

Example:

```csharp id="ofx2d5"
var customer = await dbContext.Customers
    .Include(c => c.Orders)
    .SingleOrDefaultAsync(c => c.Id == id);
```

But if you use `Select()`, EF often generates more optimized SQL without needing `Include()`:

```csharp id="2b2m0q"
var result = await dbContext.Customers
    .Where(c => c.Id == id)
    .Select(c => new
    {
        c.Name,
        Orders = c.Orders.Select(o => new
        {
            o.Id,
            o.OrderDate
        })
    })
    .SingleOrDefaultAsync();
```

This is frequently preferred for APIs because:

* smaller SQL result sets
* fewer duplicated rows
* better performance
* no tracking overhead

---

## Split Queries vs Single Query

Large nested includes can create huge JOIN explosions.

EF Core supports split queries:

```csharp id="m0n9d1"
var customer = await dbContext.Customers
    .AsSplitQuery()
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems)
    .SingleOrDefaultAsync(c => c.Id == id);
```

Instead of one giant JOIN query, EF executes multiple SQL queries internally.

Useful when:

* many collections are included
* Cartesian explosion occurs
* performance degrades

---

## You Can Also Write Equivalent LINQ Joins

Sometimes developers want explicit SQL-like joins:

```csharp id="0g4m6y"
var query =
    from c in dbContext.Customers
    join o in dbContext.Orders
        on c.Id equals o.CustomerId
    join oi in dbContext.OrderItems
        on o.Id equals oi.OrderId
    where c.Id == id
    select new
    {
        Customer = c,
        Order = o,
        OrderItem = oi
    };
```

EF translates this directly into SQL joins too.

---

## Summary

EF Core can:

* translate nested relationships into SQL joins
* generate SQL automatically from `Include()` / `ThenInclude()`
* expose the generated SQL via `ToQueryString()`
* optimize queries via projections
* split giant relationship queries into multiple SQL statements

Most common pattern:

```csharp id="mb1t0j"
var query = dbContext.Customers
    .Include(c => c.Orders)
        .ThenInclude(o => o.OrderItems);

Console.WriteLine(query.ToQueryString());

var result = await query.SingleOrDefaultAsync(c => c.Id == id);
```
---

## (*) What happen if the condition is 2 fields to singleOrDefault?

`SingleOrDefault()` accepts any boolean predicate, including multiple fields.

Example:

```csharp id="x0q4hn"
var user = await dbContext.Users
    .Include(u => u.Roles)
    .SingleOrDefaultAsync(u =>
        u.FirstName == firstName &&
        u.LastName == lastName);
```

EF Core translates that into SQL like:

```sql id="2pw6x8"
SELECT ...
FROM Users u
LEFT JOIN Roles r ON u.Id = r.UserId
WHERE u.FirstName = @firstName
  AND u.LastName = @lastName
```

---

## Important Behavior of `SingleOrDefault`

`SingleOrDefault()` means:

* return the single matching row
* return `null` if no rows match
* throw exception if MORE THAN ONE row matches

So with multiple conditions:

```csharp id="13d46n"
.SingleOrDefaultAsync(u =>
    u.FirstName == "John" &&
    u.LastName == "Smith")
```

If there are:

* 0 matches → `null`
* 1 match → entity returned
* 2+ matches → exception

Exception:

```text id="n8t6cf"
InvalidOperationException:
Sequence contains more than one matching element
```

---

## Common Safer Alternative

If uniqueness is not guaranteed in the database, use:

```csharp id="a5h0xj"
.FirstOrDefaultAsync(...)
```

instead:

```csharp id="f5rcj7"
var user = await dbContext.Users
    .FirstOrDefaultAsync(u =>
        u.FirstName == firstName &&
        u.LastName == lastName);
```

This translates similarly but uses SQL semantics equivalent to `TOP(1)`.

---

## Best Practice

Use `SingleOrDefault()` only when:

* the database guarantees uniqueness
* typically via:

  * primary key
  * unique index
  * unique constraint

Example:

```csharp id="ysr1r8"
.SingleOrDefaultAsync(u => u.Email == email)
```

because email is often unique.

---

## Multiple Conditions Example

```csharp id="w1cw34"
var order = await dbContext.Orders
    .Include(o => o.Customer)
    .Include(o => o.OrderItems)
    .SingleOrDefaultAsync(o =>
        o.OrderNumber == orderNumber &&
        o.CustomerId == customerId &&
        o.IsDeleted == false);
```

Generated SQL:

```sql id="0od8mh"
WHERE OrderNumber = @orderNumber
  AND CustomerId = @customerId
  AND IsDeleted = 0
```

---

## Dynamic Conditions

You can also build conditions separately:

```csharp id="29qq1f"
var query = dbContext.Users.AsQueryable();

query = query.Where(u => u.IsActive);

if (!string.IsNullOrEmpty(email))
{
    query = query.Where(u => u.Email == email);
}

var user = await query.SingleOrDefaultAsync();
```

EF merges all `Where()` clauses into one SQL `WHERE` statement.

---

