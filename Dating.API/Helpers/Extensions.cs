using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Dating.API.Helpers
{
    public static class Extensions
    {
        public static void  AddPaginations(this HttpResponse response,
            int currentPage, int itemsPerPage, int totalItems, int totalPages){
                var paginationHeader = new PaginationHeader(currentPage, itemsPerPage, totalItems, totalPages);
                var camelCaseFormatters = new JsonSerializerSettings();
                camelCaseFormatters.ContractResolver = new CamelCasePropertyNamesContractResolver();
                response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatters));
                response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
            }
        public static int CalculateAge(this DateTime theDateTime)
        {
            var age = DateTime.Today.Year - theDateTime.Year;
            if (theDateTime.AddYears(age) > DateTime.Today)
                age--;

            return age;
        }
    }
}