const sdk = require("api")("@chainabuse/v1.2#aea8f8elq1h521h");

sdk.auth(
	"ca_bExPd0llVUNlUnZjZFRaVXpoTXVtaEdvLmZlMXJ2RW1oODhzbnk0eFRVOThmbEE9PQ",
	"ca_bExPd0llVUNlUnZjZFRaVXpoTXVtaEdvLmZlMXJ2RW1oODhzbnk0eFRVOThmbEE9PQ"
);
const mals = async (address) => {
	sdk
		.reports({
			address: address,
			includePrivate: "false",
			page: "1",
			perPage: "50",
		})
    .then(({ data }) => {
      console.log(data);
      if (data == []) {
        return data
      }
			return [data.data];
		})
		.catch((err) => console.error(err));
};
(async () => {
	const result = await mals("0x41ad2bc63a2059f9b623533d87fe99887d794847");
	console.log(result);
})();